'use client';
import axios from 'axios';
import { useState, useEffect, useCallback, memo, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

interface AuthData {
    signUp: {
        name: string;
        email: string;
        password: string;
    };
    signIn: {
        email: string;
        password: string;
    };
}

interface InputFieldProps {
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, type: 'signUp' | 'signIn') => void;
}

// Memoized Input Field to prevent unnecessary re-renders
const InputField = memo(({ type, name, placeholder, value, onChange }: InputFieldProps) => (
    <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e, type === 'password' && name === 'password' ? 'signIn' : 'signUp')}
        required
        className={styles.input}
    />
));

InputField.displayName = 'InputField';

export default function AuthPage() {
    const router = useRouter();
    const backendPrefix = process.env.NEXT_PUBLIC_BACKEND_PREFIX;
    console.log("Backend:", backendPrefix);

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [authData, setAuthData] = useState<AuthData>({
        signUp: { name: '', email: '', password: '' },
        signIn: { email: '', password: '' },
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Toggle between login and signup and update URL
    const togglePanel = (isSignUp: boolean) => {
        setIsRightPanelActive(isSignUp);
        const action = isSignUp ? 'login' : 'signup';
        router.push(`/auth?action=${action}`);
    };

    // Set initial panel state based on URL query parameter
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const action = new URLSearchParams(window.location.search).get('action');
            setIsRightPanelActive(action === 'login');
        }
    }, []);

    // Handle input changes for both forms
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>, type: 'signUp' | 'signIn') => {
        setAuthData((prevData) => ({
            ...prevData,
            [type]: { ...prevData[type], [e.target.name]: e.target.value },
        }));
    }, []);

    // Handle form submissions for both sign-up and sign-in using Axios
    const handleFormSubmit = useCallback(async (e: FormEvent, type: 'signUp' | 'signIn') => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (type === 'signUp') {
                // Sign-up logic with Axios
                const response = await axios.post('/api/auth/signup', authData.signUp, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200 || response.status === 201) {
                    // Sign in after successful sign-up
                    const signInResponse = await axios.post('/api/auth/login', {
                        email: authData.signUp.email,
                        password: authData.signUp.password,
                    });

                    if (signInResponse.status === 200) {
                        router.push('/home');
                    } else {
                        setError('Sign-in after sign-up failed');
                    }
                } else {
                    setError(response.data?.error || 'Sign-up failed');
                }
            } else {
                // Sign-in logic with Axios
                const response = await axios.post('/api/auth/login', authData.signIn, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    router.push('/home');
                } else {
                    setError(response.data?.error || 'Sign-in failed');
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || `Something went wrong during ${type === 'signUp' ? 'sign-up' : 'sign-in'}.`);
            } else {
                setError(`Something went wrong during ${type === 'signUp' ? 'sign-up' : 'sign-in'}.`);
            }
        } finally {
            setLoading(false);
        }
    }, [authData, router]);

    const spans = new Array(200).fill(0);
    return (
        <div className={styles.ctr}>
            <section className={styles.section}>
                {spans.map((_, index) => (
                    <span key={index} className={styles.span}></span>
                ))}

                <div className={`${styles.container} ${isRightPanelActive ? styles.rightPanelActive : ''}`}>
                    {/* Sign-Up Form */}
                    <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                        <form onSubmit={(e) => handleFormSubmit(e, 'signUp')}>
                            <h1>Create Account</h1>
                            {error && isRightPanelActive && <p className={styles.error}>{error}</p>}
                            <span>or use your email for registration</span>
                            <InputField
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={authData.signUp.name}
                                onChange={handleInputChange}
                            />
                            <InputField
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={authData.signUp.email}
                                onChange={handleInputChange}
                            />
                            <InputField
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={authData.signUp.password}
                                onChange={handleInputChange}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    {/* Sign-In Form */}
                    <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                        <form onSubmit={(e) => handleFormSubmit(e, 'signIn')}>
                            <h1>Log In</h1>
                            {error && !isRightPanelActive && <p className={styles.error}>{error}</p>}
                            <span>or use your account</span>
                            <InputField
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={authData.signIn.email}
                                onChange={handleInputChange}
                            />
                            <InputField
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={authData.signIn.password}
                                onChange={handleInputChange}
                            />
                            <a href="#">Forgot your password?</a>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    {/* Overlay */}
                    <div className={styles.overlayContainer}>
                        <div className={styles.overlay}>
                            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <div className={styles.chng}>
                                    <p>Click the button below to sign up if you don't have an account yet.</p>
                                    <button className={styles.ghost} onClick={() => togglePanel(false)}>
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start your journey with us</p>
                                <div className={styles.chng}>
                                    <p>Click the button below to log in if you already have an account.</p>
                                    <button className={styles.ghost} onClick={() => togglePanel(true)}>
                                        Log In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}