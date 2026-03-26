import { useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border/50 mb-4">
                    <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-light text-muted-foreground/30 mb-2 font-mono">404</h1>
                <p className="text-sm text-muted-foreground mb-1">Pagina niet gevonden</p>
                <p className="text-xs text-muted-foreground/50 font-mono mb-6">
                    {location.pathname}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.location.href = '/'}
                >
                    Terug naar systeem
                </Button>
            </div>
        </div>
    );
}