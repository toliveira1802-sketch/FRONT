import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockUsers } from '@/lib/mock-data'
import type { Profile, AppRole } from '@/types/database'

interface AuthUser {
    id: string
    email: string
}

interface AuthContextType {
    user: AuthUser | null
    profile: Profile | null
    isLoading: boolean
    isAuthenticated: boolean
    role: AppRole | null
    signInWithGoogle: () => Promise<void>
    signInWithEmail: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signOut: () => Promise<void>
    // For demo mode
    loginAsDemo: (role: AppRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const useMockAuth = !isSupabaseConfigured()

    useEffect(() => {
        if (useMockAuth) {
            // Check localStorage for persisted mock session
            const savedUser = localStorage.getItem('mock_user')
            if (savedUser) {
                const parsed = JSON.parse(savedUser)
                setUser({ id: parsed.id, email: parsed.email || '' })
                setProfile(parsed)
            }
            setIsLoading(false)
            return
        }

        // Real Supabase auth
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    setUser({ id: session.user.id, email: session.user.email || '' })
                    await fetchProfile(session.user.id)
                }
            } catch (error) {
                console.error('Error checking session:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email || '' })
                await fetchProfile(session.user.id)
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [useMockAuth])

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }

    const signInWithGoogle = async () => {
        if (useMockAuth) {
            loginAsDemo('user')
            return
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })
        if (error) throw error
    }

    const signInWithEmail = async (email: string, password: string) => {
        if (useMockAuth) {
            // Find user by email in mock data
            const mockUser = mockUsers.find((u) => u.email === email)
            if (mockUser) {
                setUser({ id: mockUser.id, email: mockUser.email || '' })
                setProfile(mockUser)
                localStorage.setItem('mock_user', JSON.stringify(mockUser))
                return
            }
            // Default to regular user for any email/password
            loginAsDemo('user')
            return
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    const signUp = async (email: string, password: string, fullName: string) => {
        if (useMockAuth) {
            const newUser: Profile = {
                id: crypto.randomUUID(),
                email,
                full_name: fullName,
                phone: null,
                avatar_url: null,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            setUser({ id: newUser.id, email })
            setProfile(newUser)
            localStorage.setItem('mock_user', JSON.stringify(newUser))
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        })
        if (error) throw error
    }

    const signOut = async () => {
        if (useMockAuth) {
            setUser(null)
            setProfile(null)
            localStorage.removeItem('mock_user')
            return
        }

        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    const loginAsDemo = (role: AppRole) => {
        const demoUser = mockUsers.find((u) => u.role === role) || mockUsers[0]
        setUser({ id: demoUser.id, email: demoUser.email || '' })
        setProfile(demoUser)
        localStorage.setItem('mock_user', JSON.stringify(demoUser))
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                isLoading,
                isAuthenticated: !!user,
                role: profile?.role || null,
                signInWithGoogle,
                signInWithEmail,
                signUp,
                signOut,
                loginAsDemo,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
