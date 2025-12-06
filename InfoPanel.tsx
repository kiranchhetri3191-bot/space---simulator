interface InfoPanelProps {
  title: string;
  info: string;
  onClose: () => void;
}

export function InfoPanel({ title, info, onClose }: InfoPanelProps) {
  return (
    <div className="info-panel">
      <div className="info-header">
        <h2>{title}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="info-content">
        <p>{info}</p>
      </div>

      <style>{`
        .info-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 360px;
          max-width: calc(100vw - 40px);
          background: rgba(10, 10, 30, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 0;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(100, 150, 255, 0.2);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(100, 150, 255, 0.15);
        }

        .info-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #88aaff;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #aabbcc;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 100, 100, 0.3);
          color: #ffffff;
        }

        .info-content {
          padding: 16px 20px 20px;
        }

        .info-content p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #ccddee;
        }

        @media (max-width: 768px) {
          .info-panel {
            width: calc(100vw - 40px);
            bottom: 10px;
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export const CELESTIAL_INFO: Record<string, string> = {
  Sun: "The Sun is a G-type main-sequence star containing 99.86% of the Solar System's mass. Its core temperature reaches 15 million°C, where hydrogen fuses into helium. The Sun's energy output powers all life on Earth.",
  "Sagittarius A*": "Sagittarius A* is the supermassive black hole at the center of our Milky Way galaxy, with a mass of about 4 million times that of our Sun. It's located 26,000 light-years from Earth.",
  "Milky Way": "The Milky Way is a barred spiral galaxy containing 100-400 billion stars. Our Solar System is located about 26,000 light-years from the galactic center in one of the spiral arms.",
  "Black Hole": "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape. The event horizon marks the boundary beyond which escape is impossible.",
  Pluto: "Pluto was reclassified as a dwarf planet in 2006. It has 5 moons, with Charon being so large they orbit a common center of mass outside Pluto's surface.",
  Eris: "Eris is the most massive known dwarf planet. Its discovery was a key factor in Pluto's reclassification. It has one moon, Dysnomia, and is located in the scattered disk.",
  Makemake: "Makemake is one of the largest Kuiper Belt objects. It has a reddish-brown color from tholins on its surface and one known moon nicknamed MK 2.",
  Haumea: "Haumea has an elongated shape due to its rapid rotation (one day = 4 hours). It's one of the fastest spinning large objects in our solar system with two moons and a ring system."
};
