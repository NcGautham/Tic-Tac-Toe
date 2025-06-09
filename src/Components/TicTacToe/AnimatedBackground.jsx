import React from 'react';
import './AnimatedBackground.css';
import circle_icon from '../Assets/O.png';
import cross_icon from '../Assets/X.png';

const AnimatedBackground = () => {
    // Generate 15 random positions for the floating elements
    const elements = Array.from({ length: 15 }, (_, index) => ({
        id: index,
        type: Math.random() > 0.5 ? 'x' : 'o',
        size: Math.random() * 30 + 20, // Random size between 20px and 50px
        duration: Math.random() * 20 + 20, // Random duration between 20s and 40s
        delay: Math.random() * -20, // Random delay for more natural movement
        x: Math.random() * 100, // Random x position
        y: Math.random() * 100, // Random y position
    }));

    return (
        <div className="animated-background">
            {elements.map((element) => (
                <div
                    key={element.id}
                    className="floating-element"
                    style={{
                        '--size': `${element.size}px`,
                        '--duration': `${element.duration}s`,
                        '--delay': `${element.delay}s`,
                        '--x': `${element.x}%`,
                        '--y': `${element.y}%`,
                    }}
                >
                    <img
                        src={element.type === 'x' ? cross_icon : circle_icon}
                        alt={element.type}
                        style={{ opacity: 0.15 }}
                    />
                </div>
            ))}
        </div>
    );
};

export default AnimatedBackground; 