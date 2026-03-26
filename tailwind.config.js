/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			inter: ['var(--font-inter)'],
  			mono: ['var(--font-mono)'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Service colors
  			politie: 'hsl(var(--politie))',
  			brandweer: 'hsl(var(--brandweer))',
  			ambulance: 'hsl(var(--ambulance))',
  			kmar: 'hsl(var(--kmar))',
  			mmt: 'hsl(var(--mmt))',
  			dsi: 'hsl(var(--dsi))',
  			meldkamer: 'hsl(var(--meldkamer))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  safelist: [
    'bg-politie', 'bg-brandweer', 'bg-ambulance', 'bg-kmar', 'bg-mmt', 'bg-dsi', 'bg-meldkamer',
    'text-politie', 'text-brandweer', 'text-ambulance', 'text-kmar', 'text-mmt', 'text-dsi', 'text-meldkamer',
    'border-politie', 'border-brandweer', 'border-ambulance', 'border-kmar', 'border-mmt', 'border-dsi', 'border-meldkamer',
    'bg-politie/10', 'bg-brandweer/10', 'bg-ambulance/10', 'bg-kmar/10', 'bg-mmt/10', 'bg-dsi/10', 'bg-meldkamer/10',
    'bg-politie/20', 'bg-brandweer/20', 'bg-ambulance/20', 'bg-kmar/20', 'bg-mmt/20', 'bg-dsi/20', 'bg-meldkamer/20',
    'border-politie/30', 'border-brandweer/30', 'border-ambulance/30', 'border-kmar/30', 'border-mmt/30', 'border-dsi/30', 'border-meldkamer/30',
    'service-glow-politie', 'service-glow-brandweer', 'service-glow-ambulance', 'service-glow-kmar', 'service-glow-mmt', 'service-glow-dsi', 'service-glow-meldkamer',
  ],
  plugins: [require("tailwindcss-animate")],
}