import { Children } from "react"
import { Text, View } from "react-native"

import React from "react"
import colors from "../colors"

export type Colors = 'success' | 'failure' | 'base'

type CardContainerProps = {
    color: Colors,
    children: any
}

const colorMap: Record<Colors, string> = {
    'base': colors.disabled,
    'success': colors.success,
    'failure': colors.failure
}

export const CardContainer = ({ color, children }: CardContainerProps) => {

    const borderWeight = color == 'base' ? 1 : 1

    return (
        <View style={{ padding: 6, backgroundColor: colors['section-item'], borderColor: colorMap[color], borderWidth: borderWeight, borderRadius: 6 }} >
            { children }
        </View>
    ) 
}