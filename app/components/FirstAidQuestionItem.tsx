import React from "react";
import { Button, Linking, Text, TouchableOpacity, View } from "react-native";
import { FirstAidAnswer, FirstAidAnswerListType, FirstAidAnswerParagraphType, FirstAidAnswerProcedureType, FirstAidAnswerVideoLinkType, FirstAidQuestion } from "../types/types";
import colors from "../colors";

// "paragraph" | "list" | "procedure"

const FirstAidQuestionParagraph = ({ answer }: { answer: FirstAidAnswerParagraphType }) =>
    <Text style={{ fontSize: 14 }}>
      {answer.text}
    </Text>

const FirstAidQuestionList = ({ answer }: { answer: FirstAidAnswerListType }) => {
    if(!answer.title || answer?.items?.length === 0)
        return <></>
    return <>
        <Text style={{ fontSize: 14, paddingBottom: 1, fontWeight: '500' }}>{`${answer.title}:`}</Text>
        { answer.items.map(item => 
            <Text key={`first-aid-answer-content-section-${item}`} style={{ paddingLeft: 4 }}>• { item }</Text>
        )}
    </>
}

const FirstAidQuestionProcedure = ({ answer }: { answer: FirstAidAnswerProcedureType }) => {
    if(!answer.title || answer?.items?.length === 0)
        return <></>
    return <>
        <Text style={{ fontSize: 14, paddingBottom: 1, fontWeight: '500' }}>
            {`${answer.title}:`}
        </Text>
        { answer.items.map((item, i) => 
            <Text key={`first-aid-answer-content-section-${item}`} style={{ paddingLeft: 4 }}>{`${i+1}. ${item}`}</Text>
        )}
    </>
}

const FirstAidQuestionVideo = ({ answer }: { answer: FirstAidAnswerVideoLinkType }) => 
    <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity 
            onPress={() => { Linking.openURL(answer.url) }} 
            style = {{ borderWidth: 1, borderColor: colors.base, paddingVertical: 8, paddingHorizontal: 42, borderRadius: 6, marginTop: 8, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text style={{ fontSize: 14, color: colors.base, fontWeight: 'bold' }}>VIDEO</Text>
        </TouchableOpacity>
    </View>

const renderFirstAidAnswer = (answer: FirstAidAnswer): JSX.Element => {
    switch(answer.type) {
        case 'paragraph': return <FirstAidQuestionParagraph answer={answer}/>
        case 'list': return <FirstAidQuestionList answer={answer}/>
        case 'procedure': return <FirstAidQuestionProcedure answer={answer}/>
        case 'video': return <FirstAidQuestionVideo answer={answer}/>
    }
}

export const FirstAidQuestionItem = ({ q }: { q: FirstAidQuestion }) => {

    return (
        <View style={{ padding: 8, backgroundColor: colors["section-item"], borderRadius: 6, borderWidth: 1, borderColor: colors.disabled}}>
            <Text style={{ paddingBottom: 4, fontSize: 16, fontWeight: 'bold' }}>
                {q.question}
            </Text>
            { q.answers.map((q, i) => 
                <View key={`first-aid-answer-content-${i}`} style={{ paddingVertical: 2 }}>
                    { renderFirstAidAnswer(q) }
                </View>) 
            }
        </View>
    );
  };