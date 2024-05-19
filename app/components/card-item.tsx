import { Children } from "react"
import { Text, View } from "react-native"

import React from "react"
import colors from "../colors"

type Colors = 'success' | 'failure' | 'base' 

type CardItemProps = {
    color: Colors,
    children: any
}

const colorClassMap: Record<Colors, string> = {
    'base': 'bg-blue-700',
    'success': 'bg-green-600',
    'failure': 'bg-red-600'
}

export const CardItem = ({ color, children }: CardItemProps) => {
    return (
        <View className={`${colorClassMap[color]} rounded-lg pl-0.5`}>
            <View className="bg-background p-2 rounded-lg">
                { children }
            </View>
        </View>
    ) 
}