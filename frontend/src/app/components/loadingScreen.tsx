import { TbHotelService } from "react-icons/tb";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--mulberry)] z-50">
            <TbHotelService className="w-64 h-64 rounded-full border-2 text-[var(--sunshine)] border-[var(--sunshine)] shadow-2xl p-12 bg-[var(--umemurasaki)] animate-pulse" />
            <div className='flex space-x-2 justify-center items-center mt-8 dark:invert'>
                <span className='sr-only'>Loading...</span>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce'></div>
            </div>
        </div>
    );
}
