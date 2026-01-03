import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';

interface OTPInputProps {
    length?: number;
    onCodeChanged: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onCodeChanged }) => {
    const [code, setCode] = useState<string[]>(new Array(length).fill(''));
    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChangeText = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        onCodeChanged(newCode.join(''));

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    ref={(ref) => { inputs.current[index] = ref; }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
        marginVertical: 20,
    },
    input: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: '#fff',
    },
});

export default OTPInput;
