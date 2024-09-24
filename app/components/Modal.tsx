import React, { ReactElement } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import colors, { disabled } from "../colors"

type DsModalProps = {
    visible: boolean,
    title?: string,
    subtitle?: string,
    content?: ReactElement,
    actions: ReactElement<typeof TouchableOpacity>[]
}

export const DsModal = (p: DsModalProps) => {
    return(
        <Modal transparent={true} visible={p.visible} animationType="fade"> 
        <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', width: '100%', height: '100%'}}>
          <View style={{ borderRadius: 8, top: '10%', backgroundColor: colors["section-item"], padding: 8, margin: 6}}>
            {
                p.title && <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.base }}>{ p?.title }</Text>
            }
            {
                p.subtitle && <Text style={{ fontSize: 12, fontWeight: 'bold', color: disabled }}>{ p?.subtitle }</Text>
            }
            { 
                p?.content 
            }
            <View style={{ marginTop: 8, display: 'flex', flexDirection: 'row', gap: 8}}>
                { p.actions?.map((ActionElement, i) => {
                    return(
                        <View key={i} style={{ flex: 1 }}>
                            {ActionElement}
                        </View>
                    )
                }) }
            </View>
          </View>
        </View>
      </Modal>
    )
}