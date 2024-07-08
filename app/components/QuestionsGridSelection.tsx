import { StyleProp, Text, TouchableOpacity, View } from "react-native"

import React from "react"
import { Ionicons } from "@expo/vector-icons"
import colors, { background } from "../colors"


type QuestionsGridSelectionProps = {
    items: {id: number, style: StyleProp<any>}[],
    onItemClick: (id: number, index: number) => void
}

export const QuestionsGridSelection = ({items, onItemClick}: QuestionsGridSelectionProps) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 2}}>
            {
                items.map((el, i) => 
                    <TouchableOpacity key={el.id + '-' + i} onPress={() => onItemClick(el.id, i)} style={{ padding: 2, width: "16.6%" }}>
                        <View style={{...el.style, width: "100%", aspectRatio: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{i+1}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    ) 
}