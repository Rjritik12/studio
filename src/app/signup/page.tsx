
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, UserPlus, KeyRound } from 'lucide-react'; // Using KeyRound as a generic auth icon

export default function SignupPage() {
  const { signInWithGoogle, loading, error, setError } = useAuth();
  const router = useRouter();

  const handleGoogleSignup = async () => {
    setError(null); // Clear previous errors
    const user = await signInWithGoogle();
    if (user) {
      router.push('/profile'); // Redirect to profile or dashboard after signup
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="font-headline text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join EduVerse by signing up with your Google account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <p className="text-sm text-center text-destructive">{error}</p>}
          <Button 
            onClick={handleGoogleSignup} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            )}
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in with Google
            </Link>
          </p>
           <p className="text-xs text-muted-foreground">
            By signing up, you agree to our (Non-existent) Terms of Service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
