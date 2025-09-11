import { useState, useEffect, useMemo } from 'react';

const useTypingEffect = (words: string[], typeSpeed = 150, deleteSpeed = 75, delay = 1500) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(typeSpeed);
    const wordIndex = useMemo(() => loopNum % words.length, [loopNum, words]);

    useEffect(() => {
        const handleTyping = () => {
            const fullText = words[wordIndex];
            setText(currentText => 
                isDeleting 
                    ? fullText.substring(0, currentText.length - 1)
                    : fullText.substring(0, currentText.length + 1)
            );
            setTypingSpeed(isDeleting ? deleteSpeed : typeSpeed);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(current => current + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, words, typeSpeed, deleteSpeed, delay, wordIndex]);

    return text;
};

export default useTypingEffect;