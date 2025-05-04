import { Cat, Dog, Bird, Rabbit, Fish, Bot } from "lucide-react";
import { cn } from "@/lib/utils";


export function AnimalAvatar({ animal, size = "md", className }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const animalColors = {
        cat: "bg-pink-100 text-pink-500",
        dog: "bg-amber-100 text-amber-500",
        bird: "bg-blue-100 text-blue-500",
        rabbit: "bg-purple-100 text-purple-500",
        fish: "bg-cyan-100 text-cyan-500",
        bot: "bg-emerald-100 text-emerald-600",
    };

    const AnimalIcon = () => {
        switch (animal) {
            case "cat":
                return <Cat className="h-5 w-5" />;
            case "dog":
                return <Dog className="h-5 w-5" />;
            case "bird":
                return <Bird className="h-5 w-5" />;
            case "rabbit":
                return <Rabbit className="h-5 w-5" />;
            case "fish":
                return <Fish className="h-5 w-5" />;
            case "bot":
                return <Bot className="h-5 w-5" />;
            default:
                return <Cat className="h-5 w-5" />;
        }
    };

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center",
                sizeClasses[size],
                animalColors[animal],
                "animate-bounce-in",
                className
            )}
        >
            <AnimalIcon />
        </div>
    );
}


