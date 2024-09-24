import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View, AppState } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useRef, useState } from "react";

export default function App() {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    async function verifyAvaiableAuthentication() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        console.log("compatible", compatible);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log(
            "types",
            types.map((type) => LocalAuthentication.AuthenticationType[type])
        );
    }
    async function handleAuthentication() {
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isBiometricEnrolled) {
            return Alert.alert("Login", "Nenhuma biometria encontrada");
        }
        if (appStateVisible) {
            const auth = await LocalAuthentication.authenticateAsync({
                promptMessage: "login com biometria",
                fallbackLabel: "Biometria não reconhecida ",
            });
            console.log("auth", auth);
        }
    }
    useEffect(() => {
        verifyAvaiableAuthentication();
    }, []);
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                handleAuthentication();
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log("AppState", appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
