import { View, Text } from "react-native"
import colors from "../colors"
import React from "react"

export const NoResultItem = () => {
    return (
        <View style={{ backgroundColor: colors.rootBackground, paddingHorizontal: 2, paddingVertical: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: colors.disabled, fontSize: 22 }}>Nema rezultata</Text>
          </View>
    )
}