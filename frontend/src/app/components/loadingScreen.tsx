import Image from 'next/image'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--navy)] z-50">
            <Image
                src="/oikos-logo.png"
                width={256}
                height={256}
                alt="Logo"
                priority
                className="w-64 h-64 rounded-full border-2 border-[var(--sunshine)] shadow-2xl p-2 bg-white animate-pulse"
            />
            <div className='flex space-x-2 justify-center items-center mt-8 dark:invert'>
                <span className='sr-only'>Loading...</span>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-8 w-8 bg-[var(--sunshine)] rounded-full animate-bounce'></div>
            </div>
        </div>
    );
}
