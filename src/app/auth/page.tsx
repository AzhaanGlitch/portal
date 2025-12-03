'use client';
import axios from 'axios';
import { useState, useEffect, useCallback, memo, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthData {
    signUp: {
        username: string;
        email: string;
        password: string;
        first_name: string;
        last_name: string;
    };
    signIn: {
        email: string;
        password: string;
    };
}

export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [authData, setAuthData] = useState<AuthData>({
        signUp: { username: '', email: '', password: '', first_name: '', last_name: '' },
        signIn: { email: '', password: '' },
    });
    const [loading, setLoading] = useState(false);

    // Set initial tab based on URL query parameter
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const action = new URLSearchParams(window.location.search).get('action');
            if (action === 'login') {
                setActiveTab('login');
            } else if (action === 'signup') {
                setActiveTab('signup');
            }
        }
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value as 'login' | 'signup');
        router.push(`/auth?action=${value}`);
    };

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, type: "signUp" | "signIn") => {
            const { name, value } = e.target;

            setAuthData((prevData) => {
                const updatedData = { ...prevData[type], [name]: value };

                if (name === "email" && type === "signUp") {
                    (updatedData as AuthData['signUp']).username = value;
                }

                return {
                    ...prevData,
                    [type]: updatedData,
                };
            });
        },
        []
    );

    const handleFormSubmit = useCallback(async (e: FormEvent, type: 'signUp' | 'signIn') => {
        e.preventDefault();
        setLoading(true);

        try {
            if (type === 'signUp') {
                const response = await api.post('/accounts/signup/', authData.signUp);
                const username = response.data?.username || " ";
                localStorage.setItem('i2dcUsername@#12', username);

                if (response.status === 200 || response.status === 201) {
                    authData.signUp.first_name = '';
                    authData.signUp.last_name = '';
                    authData.signUp.email = '';
                    authData.signUp.password = '';
                    authData.signUp.username = '';

                    router.push('/auth/verify-otp');
                    toast.success('Account created successfully! Please verify your email.');
                } else {
                    throw new Error(response.data?.error || "Sign-up failed");
                }
            } else {
                const response = await api.post('/accounts/login/', authData.signIn);
                if (response.status === 200) {
                    router.push('/');
                    toast.success('Welcome back!');
                } else {
                    throw new Error(response.data?.error || 'Sign-in failed');
                }
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error ||
                error.message ||
                `${type === 'signUp' ? 'Sign-up' : 'Sign-in'} failed`;
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [authData, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome to I2EDC
                    </h1>
                    <p className="text-muted-foreground">
                        {activeTab === 'login' ? 'Sign in to your account' : 'Create your account to get started'}
                    </p>
                </div>

                <Card className="border-border/50 shadow-xl">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <CardHeader className="space-y-1">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login" className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value="signup" className="flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        <TabsContent value="login">
                            <form onSubmit={(e) => handleFormSubmit(e, 'signIn')}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={authData.signIn.email}
                                                onChange={(e) => handleInputChange(e, 'signIn')}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                name="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={authData.signIn.password}
                                                onChange={(e) => handleInputChange(e, 'signIn')}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <a 
                                            href="#" 
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col space-y-4">
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            'Signing in...'
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                    
                                    <div className="text-center text-sm">
                                        <a 
                                            href="/auth/verify-otp" 
                                            className="text-primary hover:underline"
                                        >
                                            Verify your account
                                        </a>
                                    </div>
                                </CardFooter>
                            </form>
                        </TabsContent>

                        {/* Sign Up Tab */}
                        <TabsContent value="signup">
                            <form onSubmit={(e) => handleFormSubmit(e, 'signUp')}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="first-name"
                                                    name="first_name"
                                                    type="text"
                                                    placeholder="John"
                                                    value={authData.signUp.first_name}
                                                    onChange={(e) => handleInputChange(e, 'signUp')}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="last-name"
                                                    name="last_name"
                                                    type="text"
                                                    placeholder="Doe"
                                                    value={authData.signUp.last_name}
                                                    onChange={(e) => handleInputChange(e, 'signUp')}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={authData.signUp.email}
                                                onChange={(e) => handleInputChange(e, 'signUp')}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-password"
                                                name="password"
                                                type="password"
                                                placeholder="Create a strong password"
                                                value={authData.signUp.password}
                                                onChange={(e) => handleInputChange(e, 'signUp')}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            'Creating account...'
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}