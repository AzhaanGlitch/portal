'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 0, 0]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={`h-full relative w-full ${containerClassName}`}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 0, 0]]}
          dotSize={dotSize ?? 3}
          opacities={opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]}
          shader={`${reverse ? 'u_reverse_active' : 'false'}_;animation_speed_factor_${animationSpeed.toFixed(1)};`}
          center={['x', 'y']}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ('x' | 'y')[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = '',
  center = ['x', 'y'],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];
    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    } else if (colors.length === 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [color[0] / 255, color[1] / 255, color[2] / 255]),
        type: 'uniform3fv',
      },
      u_opacities: { value: opacities, type: 'uniform1fv' },
      u_total_size: { value: totalSize, type: 'uniform1f' },
      u_dot_size: { value: dotSize, type: 'uniform1f' },
      u_reverse: { value: shader.includes('u_reverse_active') ? 1 : 0, type: 'uniform1i' },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${center.includes('x') ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ''}
            ${center.includes('y') ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ''}
            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);
            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
            vec3 color = u_colors[int(show_offset * 6.0)];
            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);
            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }
            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({ source, uniforms, maxFps = 60 }: { source: string; maxFps?: number; uniforms: Uniforms }) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.ShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = clock.getElapsedTime();
  });

  const getUniforms = () => {
    const preparedUniforms: { [key: string]: { value: any; type?: string } } = {};
    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      switch (uniform.type) {
        case 'uniform1f':
          preparedUniforms[uniformName] = { value: uniform.value, type: '1f' };
          break;
        case 'uniform1i':
          preparedUniforms[uniformName] = { value: uniform.value, type: '1i' };
          break;
        case 'uniform3f':
          preparedUniforms[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value as number[]), type: '3f' };
          break;
        case 'uniform1fv':
          preparedUniforms[uniformName] = { value: uniform.value, type: '1fv' };
          break;
        case 'uniform3fv':
          preparedUniforms[uniformName] = { 
            value: (uniform.value as number[][]).map((v: number[]) => new THREE.Vector3().fromArray(v)), 
            type: '3fv' 
          };
          break;
        case 'uniform2f':
          preparedUniforms[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value as number[]), type: '2f' };
          break;
      }
    }
    preparedUniforms['u_time'] = { value: 0, type: '1f' };
    preparedUniforms['u_resolution'] = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
    return preparedUniforms;
  };

  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }`,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const action = new URLSearchParams(window.location.search).get('action');
      setIsSignUp(action === 'signup');
      if (action === 'signup') {
        setStep('signup');
      }
    }
  }, []);

  const handleEmailContinue = () => {
    if (email) {
      setStep('signup');
      setIsSignUp(true);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      console.log('🔵 Attempting login with:', { email });
      const response = await api.post('/accounts/login/', { email, password });
      console.log('✅ Login response:', response);
      
      if (response.status === 200) {
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => {
          setStep('success');
          toast.success('Welcome back!');
          setTimeout(() => router.push('/'), 2000);
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      toast.error(error?.response?.data?.error || error?.message || 'Sign-in failed. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      console.log('🔵 Attempting signup with:', { email, firstName, lastName });
      const response = await api.post('/accounts/signup/', {
        username: email,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      console.log('✅ Signup response:', response);
      
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('i2dcUsername@#12', response.data?.username || email);
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => {
          toast.success('Account created! Please verify your email');
          router.push('/auth/verify-otp');
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      toast.error(error?.response?.data?.error || error?.message || 'Sign-up failed. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'signup') {
      setStep('email');
      setIsSignUp(false);
      router.push('/auth');
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-white relative">
      <div className="absolute inset-0 z-0">
        {/* 🎨 UPDATED: Bigger particles (dotSize increased from 6 to 12) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-white"
              colors={[[59, 130, 246], [147, 51, 234]]}
              dotSize={12}
              reverse={false}
            />
          </div>
        )}
        
        {/* 🎨 UPDATED: Bigger particles (dotSize increased from 6 to 12) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-white"
              colors={[[59, 130, 246], [147, 51, 234]]}
              dotSize={12}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center px-4">
            <div className="w-full mt-[150px] max-w-sm">
              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      {/* 🎨 UPDATED: Added gradient text styling */}
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-[#3b82f6] to-[#9333ea] bg-clip-text text-transparent">
                        Welcome To I2EDC
                      </h1>
                      <p className="text-[1.8rem] text-black/70 font-light">Sign-in to your account</p>
                    </div>

                    <div className="space-y-4">
                      <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-black/5 hover:bg-black/10 text-black border border-black/10 rounded-full py-3 px-4 transition-colors">
                        <span className="text-lg">G</span>
                        <span>Sign in with Google</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-black/10 flex-1" />
                        <span className="text-black/40 text-sm">or</span>
                        <div className="h-px bg-black/10 flex-1" />
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          placeholder="info@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEmailContinue()}
                          className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                        />
                        <button
                          onClick={handleEmailContinue}
                          className="absolute right-1.5 top-1.5 text-black w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/20 transition-colors group overflow-hidden"
                        >
                          <span className="relative w-full h-full block overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                              →
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                              →
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-black/40 pt-10">
                      By signing up, you agree to the{' '}
                      <a href="#" className="underline hover:text-black/60">Product Terms</a>,{' '}
                      <a href="#" className="underline hover:text-black/60">Policies</a>,{' '}
                      <a href="#" className="underline hover:text-black/60">Privacy Notice</a>, and{' '}
                      <a href="#" className="underline hover:text-black/60">Cookie Notice</a>.
                    </p>
                  </motion.div>
                ) : step === 'signup' ? (
                  <motion.div
                    key="signup-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-black">
                        {isSignUp ? 'Complete Your Profile' : 'Enter Your Password'}
                      </h1>
                      <p className="text-[1.25rem] text-black/50 font-light">{email}</p>
                    </div>

                    <div className="space-y-4">
                      {isSignUp && (
                        <>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full backdrop-blur-[1px] text-black border border-black/10 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full backdrop-blur-[1px] text-black border border-black/10 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                          />
                        </>
                      )}
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (isSignUp ? handleSignUp() : handleSignIn())}
                        className="w-full backdrop-blur-[1px] text-black border border-black/10 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />

                      <div className="flex w-full gap-3 pt-4">
                        <motion.button
                          onClick={handleBack}
                          className="rounded-full bg-black text-white font-medium px-8 py-3 hover:bg-black/90 transition-colors w-[30%]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back
                        </motion.button>
                        <motion.button
                          onClick={isSignUp ? handleSignUp : handleSignIn}
                          disabled={loading}
                          className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                            loading ? 'bg-gray-200 text-black/50 border-black/10 cursor-not-allowed' : 'bg-black text-white border-transparent hover:bg-black/90 cursor-pointer'
                          }`}
                        >
                          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </motion.button>
                      </div>
                    </div>

                    <div className="pt-16">
                      <p className="text-xs text-black/40">
                        By signing up, you agree to the{' '}
                        <a href="#" className="underline hover:text-black/60">Product Terms</a>,{' '}
                        <a href="#" className="underline hover:text-black/60">Policies</a>,{' '}
                        <a href="#" className="underline hover:text-black/60">Privacy Notice</a>, and{' '}
                        <a href="#" className="underline hover:text-black/60">Cookie Notice</a>.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-black">
                        You're in!
                      </h1>
                      <p className="text-[1.25rem] text-black/50 font-light">Welcome</p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-black to-black/70 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full rounded-full bg-black text-white font-medium py-3 hover:bg-black/90 transition-colors"
                    >
                      Continue to Dashboard
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}