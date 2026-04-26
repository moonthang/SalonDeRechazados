import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center" aria-label="Salón de Rechazados Films Home">
        <Image 
            src="https://ik.imagekit.io/axct8mpp27/Screenshots/SDR_Logo4.png"
            alt="Salón de Rechazados Films Logo"
            width={180}
            height={60}
            className="h-10 w-auto"
        />
    </div>
  );
}
