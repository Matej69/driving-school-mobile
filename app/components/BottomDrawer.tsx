import BottomSheet from "@gorhom/bottom-sheet";
import React, { Ref } from "react";
import colors from "../colors";

const snapPoints = ['25%', '50%', '75%'];

type BottomDrawerProps = {
    children: JSX.Element,
}

export const BottomDrawer = React.forwardRef((props: BottomDrawerProps, ref: Ref<BottomSheet>) => (
        <BottomSheet  
            //containerStyle={{ backgroundColor: 'rgba(52, 52, 52, 0.8)' }}
            backgroundStyle={{borderTopWidth: 2, borderTopColor: colors.base }} 
            handleIndicatorStyle={{ backgroundColor: colors.base }}
            ref={ref} 
            enablePanDownToClose 
            index={0} 
            snapPoints={snapPoints}>
                {props.children}
        </BottomSheet>
    ));