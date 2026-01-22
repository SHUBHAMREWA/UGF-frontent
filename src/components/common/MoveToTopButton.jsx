import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowUpLong } from "react-icons/fa6";
import "./MoveToTopButton.css";

const MoveToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return visible ? (
        <motion.div
      vvvv  onClick={scrollToTop}
            className="move-to-top-div p-2 lg:p-4 rounded-full fixed bottom-20 right-8 lg:bottom-12 lg:right-12 cursor-pointer shadow-sm shadow-gray-400 bg-white  "
            // initial={{ opacity: 0, scale: 0.5 }}
            animate={{  
                 opacity: 1, 
                  scale: 1  ,
                  transform : ["translateY(-2px)"  , "translateY(2px)" , "translateY(-2px)"], 

                 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
                 duration: 0.7  , 
                 repeat : Infinity ,
                 repeatType : "reverse"
                 }}
        >
            <button  className="text-gray-700 move-to-top-button rounded-full ">
                <FaArrowUpLong className="text-2xl lg:text-3xl" />
            </button>
        </motion.div>
    ) : null;
};

export default MoveToTopButton;