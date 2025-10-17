import { Button } from "@/lib/common/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/common/ui/card";
import { Input } from "@/lib/common/ui/input";
import { Label } from "@/lib/common/ui/label";
import FirebaseExample from "@/lib/common/components/FirebaseExample";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to BeerBro
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A Next.js project with TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Setup</CardTitle>
              <CardDescription>
                Your project is ready with all the modern tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
              <CardDescription>
                Built with the latest and greatest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Next.js 14 with App Router
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  shadcn/ui Components
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  ESLint
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="mr-4" asChild>
            <a href="/admin">Admin Console</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/login">Login</a>
          </Button>
        </div>

        {/* Firebase Example Component */}
        <div className="mt-12">
          <FirebaseExample />
        </div>
      </div>
    </div>
  );
}
