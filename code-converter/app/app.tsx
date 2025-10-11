import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Dimensions } from "react-native";

export default function App() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [inputLang, setInputLang] = useState("Python");
  const [targetLang, setTargetLang] = useState("JavaScript");

  const languages = ["Python", "JavaScript", "C++", "Java", "Go"];

  const handleConvert = () => {
    setOutputCode(`// Converted ${inputLang} → ${targetLang}\n${inputCode}`);
  };

  const handleRun = () => {
    setOutputCode((prev) => prev + `\n\n// Output: (dummy output here)`);
  };

  const handleFix = () => {
    setOutputCode((prev) => prev + `\n\n// Fixed code placeholder`);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>AI Code Converter</Text>

      <Text style={styles.label}>Input Language:</Text>
      <View style={styles.langRow}>
        {languages.map((lang) => (
          <Button
            key={lang}
            title={lang}
            onPress={() => setInputLang(lang)}
            color={inputLang === lang ? "green" : "gray"}
          />
        ))}
      </View>

      <Text style={styles.label}>Target Language:</Text>
      <View style={styles.langRow}>
        {languages.map((lang) => (
          <Button
            key={lang}
            title={lang}
            onPress={() => setTargetLang(lang)}
            color={targetLang === lang ? "green" : "gray"}
          />
        ))}
      </View>

      <TextInput
        style={[styles.input, { width: screenWidth * 0.95 }]}
        placeholder="Paste your code here"
        multiline
        value={inputCode}
        onChangeText={setInputCode}
      />

      <View style={[styles.buttonRow, { width: screenWidth * 0.95 }]}>
        <Button title="Convert" onPress={handleConvert} />
        <Button title="Run" onPress={handleRun} />
        <Button title="Fix" onPress={handleFix} />
      </View>

      <Text style={styles.heading}>Output:</Text>
      <ScrollView style={[styles.outputContainer, { width: screenWidth * 0.95 }]}>
        <Text style={styles.output}>{outputCode}</Text>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 8,
  },
  label: {
    alignSelf: "flex-start",
    marginVertical: 4,
    fontWeight: "600",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    minHeight: 120,
    padding: 8,
    fontFamily: "monospace",
    marginVertical: 8,
  },
  outputContainer: {
    borderColor: "gray",
    borderWidth: 1,
    minHeight: 150,
    padding: 8,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  output: {
    fontFamily: "monospace",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  langRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 4,
    justifyContent: "flex-start",
  },
});
