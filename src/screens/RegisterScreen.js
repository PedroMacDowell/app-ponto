import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, confirmPassword);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erro de Cadastro', result.error || 'Falha ao cadastrar');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Button
            title="← Voltar"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          <Text style={styles.title}>Criar Conta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <Input
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <Input
              placeholder="Crie uma senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <Input
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            disabled={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Button
              title="Faça login"
              onPress={() => navigation.goBack()}
              style={styles.linkButton}
              textStyle={styles.linkButtonText}
            />
          </View>
        </View>
      </View>

      <LoadingOverlay visible={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkButton: {
    backgroundColor: 'transparent',
  },
  linkButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
