import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/core";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const bgImage = `${import.meta.env.BASE_URL}images/splash-bg.png`;

  if (isLoading) return <div className="h-[100dvh] bg-background" />;
  if (user) return <Redirect to="/" />;

  return (
    <div className="h-[100dvh] w-full relative flex flex-col items-center max-w-md mx-auto bg-background">
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/70 to-transparent" />

      <div className="z-20 flex flex-col items-center text-center px-8 w-full h-full">
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-display italic text-7xl md:text-8xl text-foreground font-bold tracking-tight">DRIP.</h1>
            <p className="mt-6 font-display uppercase tracking-[0.3em] text-muted-foreground text-sm">
              Rate Your Drip. <br/> Own Your Style.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full flex flex-col gap-3 pb-12"
        >
          <Link href="/register" className="block w-full">
            <Button className="w-full" size="lg" variant="primary">Create Account</Button>
          </Link>
          <Link href="/login" className="block w-full">
            <Button className="w-full" size="lg" variant="outline">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
