import { useEffect, useRef, useState } from "react";

export const useTabNavigation = ({initActiveTab}: {initActiveTab: number}) => {
    const navItemRefs: { current: any[] } = useRef([]);
    const [activeTab, setActiveTab] = useState(initActiveTab);
    const [prevActiveTab, setPrevActiveTab] = useState(initActiveTab);
    
    const iconAnimation = {
        scaleMin : 0.7,
        scaleMax : 1,
    }

    const animations = {
        inactiveToActive: { 0: {scale: iconAnimation.scaleMin}, 1: {scale: iconAnimation.scaleMax} },
        activeToInactive: { 0: {scale: iconAnimation.scaleMax, rotate: '90deg'}, 1: {scale: iconAnimation.scaleMin, rotate: '0deg'} },
        default: { 0: {scale: iconAnimation.scaleMin}, 1: {scale: iconAnimation.scaleMin} }
    }
      
    useEffect(() => {
        navItemRefs.current.forEach((item, i) => {
            if(i === activeTab && prevActiveTab !== activeTab)
                item.animate(animations.inactiveToActive)
            else if(i === prevActiveTab && prevActiveTab !== activeTab)
                item.animate(animations.activeToInactive)
            else
                item.animate(animations.default)
        })
        setPrevActiveTab(activeTab);       
      }, [activeTab])

    return { navItemRefs, activeTab, setActiveTab }
}