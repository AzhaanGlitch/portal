'use client';
import React, { useState, useEffect } from 'react';
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
  const ref = React.useRef<THREE.Mesh>(null);

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const action = new URLSearchParams(window.location.search).get('action');
      setIsSignUp(action === 'signup');
    }
  }, []);

  const handleSignIn = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/accounts/login/', { username, password });
      
      if (response.status === 200) {
        if (response.data.access) localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) localStorage.setItem('refresh_token', response.data.refresh);
        
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => {
          toast.success('Welcome back!');
          window.location.href = '/';
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Sign-in failed');
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
      const response = await api.post('/accounts/signup/', {
        username: email,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      
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
      console.error('Signup error:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-white relative">
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-white"
              colors={[[59, 130, 246], [147, 51, 234]]}
              dotSize={18}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-white"
              colors={[[59, 130, 246], [147, 51, 234]]}
              dotSize={18}
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
                {!isSignUp ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-[#3b82f6] to-[#9333ea] bg-clip-text text-transparent">
                        Welcome to I2EDC
                      </h1>
                      <p className="text-[1.8rem] text-black/70 font-light">Sign in to continue</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />

                      <motion.button
                        onClick={handleSignIn}
                        disabled={loading}
                        className={`w-full rounded-full font-medium py-3 transition-all ${
                          loading ? 'bg-gray-200 text-black/50 cursor-not-allowed' : 'bg-black text-white hover:bg-black/90'
                        }`}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </motion.button>

                      <p className="text-sm text-black/50">
                        Don't have an account?{' '}
                        <button
                          onClick={() => {
                            setIsSignUp(true);
                            router.push('/auth?action=signup');
                          }}
                          className="text-black font-medium underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-[#3b82f6] to-[#9333ea] bg-clip-text text-transparent">
                        Create Account
                      </h1>
                      <p className="text-[1.8rem] text-black/70 font-light">Join us today</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
                        className="w-full backdrop-blur-[1px] text-black border border-black/30 rounded-full py-3 px-4 focus:outline-none focus:border-black/30 text-center bg-transparent"
                      />

                      <motion.button
                        onClick={handleSignUp}
                        disabled={loading}
                        className={`w-full rounded-full font-medium py-3 transition-all ${
                          loading ? 'bg-gray-200 text-black/50 cursor-not-allowed' : 'bg-black text-white hover:bg-black/90'
                        }`}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </motion.button>

                      <p className="text-sm text-black/50">
                        Already have an account?{' '}
                        <button
                          onClick={() => {
                            setIsSignUp(false);
                            router.push('/auth');
                          }}
                          className="text-black font-medium underline"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
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