import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from "react-native";

const Layout: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [inputLang, setInputLang] = useState<string>("Python");
  const [targetLang, setTargetLang] = useState<string>("JavaScript");
  const [loading, setLoading] = useState<boolean>(false);

  const languages: string[] = ["Python", "JavaScript", "C++", "Java", "Go"];

  const callBackendAPI = async (mode: "convert" | "fix") => {
    if (!inputCode.trim()) return;
    try {
      setLoading(true);
      const response = await fetch("https://finedgeofficial.netlify.app/api/code-converter/route.ts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inputCode,
          inputLang,
          targetLang,
          mode,
        }),
      });
      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", data.error);
      } else {
        setOutputCode(data.result);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to call backend API");
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => callBackendAPI("convert");
  const handleFix = () => callBackendAPI("fix");
  const handleRun = () => {
    Alert.alert("Info", "Run feature not implemented. Use JDoodle/Piston API for safe execution.");
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>AI Code Converter</Text>

      <Text style={styles.label}>Input Language:</Text>
      <View style={styles.langRow}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang}
            style={[styles.langButton, inputLang === lang && styles.selectedLang]}
            onPress={() => setInputLang(lang)}
          >
            <Text style={[styles.langText, inputLang === lang && styles.selectedLangText]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Target Language:</Text>
      <View style={styles.langRow}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang}
            style={[styles.langButton, targetLang === lang && styles.selectedLang]}
            onPress={() => setTargetLang(lang)}
          >
            <Text style={[styles.langText, targetLang === lang && styles.selectedLangText]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Input Code:</Text>
      <ScrollView style={[styles.inputContainer, { width: screenWidth * 0.95 }]} horizontal>
        <TextInput
          style={styles.input}
          placeholder="Paste your code here"
          placeholderTextColor="#888"
          multiline
          value={inputCode}
          onChangeText={setInputCode}
        />
      </ScrollView>

      <View style={[styles.buttonRow, { width: screenWidth * 0.95 }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleConvert} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Processing..." : "Convert"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleRun}>
          <Text style={styles.buttonText}>Run</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleFix} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Processing..." : "Fix"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Output:</Text>
      <ScrollView style={[styles.outputContainer, { width: screenWidth * 0.95 }]}>
        <Text style={styles.output}>{outputCode}</Text>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    minHeight: "100%",
  },
  heading: { fontSize: 24, fontWeight: "bold", color: "#fff", marginVertical: 8 },
  label: { alignSelf: "flex-start", marginVertical: 4, fontWeight: "600", color: "#fff" },
  langRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 4 },
  langButton: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#2d2d2d",
  },
  selectedLang: { backgroundColor: "#007acc", borderColor: "#007acc" },
  langText: { color: "#fff", fontWeight: "500" },
  selectedLangText: { color: "#fff", fontWeight: "bold" },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    marginVertical: 8,
    backgroundColor: "#1e1e1e",
    padding: 4,
    maxHeight: 200,
  },
  input: { color: "#d4d4d4", fontFamily: "monospace", minHeight: 150, padding: 8, width: "100%" },
  outputContainer: {
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 150,
    padding: 8,
    backgroundColor: "#252526",
    marginVertical: 8,
  },
  output: { fontFamily: "monospace", color: "#d4d4d4" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", marginVertical: 8 },
  actionButton: { backgroundColor: "#007acc", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, marginVertical: 4 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default Layout;
