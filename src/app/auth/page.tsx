'use client';
import axios from 'axios';
import { useState, useEffect, useCallback, memo, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './auth.module.css';

interface AuthData {
    signUp: {
        name: string;
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
        onChange={(e) => onChange(e, name.includes('password') ? 'signIn' : 'signUp')}
        required
        className={styles.input}
    />
));

InputField.displayName = 'InputField';

export default function AuthPage() {
    const router = useRouter();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [authData, setAuthData] = useState<AuthData>({
        signUp: { name: '', email: '', password: '', first_name: '', last_name: '' },
        signIn: { email: '', password: '' },
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Toggle between login and signup and update URL
    const togglePanel = (isSignUp: boolean) => {
        console.log("Toggling panel. isSignUp:", isSignUp);
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
    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, type: "signUp" | "signIn") => {
            const { name, value } = e.target;

            setAuthData((prevData) => {
                const updatedData = { ...prevData[type], [name]: value };

                // Remove the automatic name = email assignment
                // Only set name = email if you specifically want that behavior
                // if (name === "email" && type === "signUp") {
                //     (updatedData as AuthData['signUp']).name = value;
                // }

                return {
                    ...prevData,
                    [type]: updatedData,
                };
            });
        },
        []
    );

    // Handle form submissions for both sign-up and sign-in using Axios
    const handleFormSubmit = useCallback(async (e: FormEvent, type: 'signUp' | 'signIn') => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (type === 'signUp') {
                // Sign-up logic with Axios
                const response = await axios.post(`/accounts/signup/`, authData.signUp)
                
                console.log("Sign-up response:", response);
                if (response.status === 200 || response.status === 201) {
                    // Sign in after successful sign-up
                    // const signInResponse = await axios.post(`${backendPrefix}/api/accounts/login`, {
                    //     email: authData.signUp.email,
                    //     password: authData.signUp.password,
                    // });

                    if (true) {
                        router.push('/');
                    } else {
                        setError('Sign-in after sign-up failed');
                    }
                } else {
                    setError(response.data?.error || 'Sign-up failed');
                }
            } else {
                // Sign-in logic with Axios
                const response = await api.post('/accounts/login/', authData.signIn);

                if (response.status === 200) {
                    // setUser({ email: authData.signIn.email });
                    router.push('/');
                } else {
                    setError(response.data?.error || 'Sign-in failed');
                }
            }
        } catch (error: unknown) {
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
                                name="first_name"
                                placeholder="First Name"
                                value={authData.signUp.first_name}
                                onChange={(e) => handleInputChange(e, 'signUp')}
                            />
                            <InputField
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={authData.signUp.last_name}
                                onChange={(e) => handleInputChange(e, 'signUp')}
                            />
                            <InputField
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={authData.signUp.email}
                                onChange={(e) => handleInputChange(e, 'signUp')}
                            />
                            <InputField
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={authData.signUp.password}
                                onChange={(e) => handleInputChange(e, 'signUp')}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>

                            <div className={styles.changeTag}>
                                <p>Already have an account?</p>
                                <button className={styles.ghost} onClick={() => togglePanel(isRightPanelActive ? false : true)}>
                                    Log In
                                </button>
                            </div>
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
                                onChange={(e) => handleInputChange(e, 'signIn')}
                            />
                            <InputField
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={authData.signIn.password}
                                onChange={(e) => handleInputChange(e, 'signIn')}
                            />
                            <a href="#">Forgot your password?</a>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                            <div className={styles.changeTag}>
                                <p>Don&lsquo;t have an account?</p>
                                <button className={styles.ghost} onClick={() => togglePanel(isRightPanelActive ? false : true)}>
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Overlay */}
                    <div className={styles.overlayContainer}>
                        <div className={styles.overlay}>
                            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <div className={styles.chng}>
                                    <p>Click the button below to sign up if you don&lsquo;t have an account yet.</p>
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