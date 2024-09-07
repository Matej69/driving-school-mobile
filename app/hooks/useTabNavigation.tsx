import { useEffect, useMemo, useRef, useState } from "react";
import useStore from "../store/store";
import { NavigationRoutesKeys, ParamType } from "../types/types";
import { useNavigation, router } from "expo-router";

export const useTabNavigation = () => {
    const navItemRefs: { current: any[] } = useRef([]);
    const { prevActiveTab, activeTab, setActiveTab } = useStore()
    const navigation = useNavigation();

    const iconAnimation = useMemo(() => ({
        scaleMin : 0.7,
        scaleMax : 1,
    }), [])

    const animations = useMemo(() => ({
        inactiveToActive: { 0: {scale: iconAnimation.scaleMin}, 1: {scale: iconAnimation.scaleMax} },
        activeToInactive: { 0: {scale: iconAnimation.scaleMax, rotate: '90deg'}, 1: {scale: iconAnimation.scaleMin, rotate: '0deg'} },
        default: { 0: {scale: iconAnimation.scaleMin}, 1: {scale: iconAnimation.scaleMin} }
    }),[])
      
    useEffect(() => {
        navItemRefs.current.forEach(item => {
            if(item === activeTab && prevActiveTab !== activeTab)
                item.animate(animations.inactiveToActive)
            else if(item === prevActiveTab && prevActiveTab !== activeTab)
                item.animate(animations.activeToInactive)
            else
                item.animate(animations.default)
        })
      }, [activeTab])

      const navigate = (routeKey: NavigationRoutesKeys, params?: Record<ParamType, string>) => {
        setActiveTab(routeKey)
        router.push({
            pathname: 'finished-exams',
            params
          });
      }

      const resetParams = () => {
        router.setParams<ParamType>({ examDate: null });
      }

    return { navItemRefs, activeTab, setActiveTab, navigate, resetParams }
}