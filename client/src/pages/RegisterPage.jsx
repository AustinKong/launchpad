import { VStack, Heading, Input, Field, Button } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { PiGoogleLogoBold } from "react-icons/pi";
import LabeledSeparator from "@/components/LabeledSeparator";
import { useAsyncRequest } from "@/hooks/useAsyncRequest";
import { registerWithEmail } from "@/services/authService";

export default function RegisterPage() {
  const { run: register, isLoading: registerIsLoading } = useAsyncRequest(registerWithEmail, {
    onSuccess: () => {
      // Redirect
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <VStack w="30%" alignItems="stretch" h="fit-content">
      <Heading size="2xl" textAlign="center">
        Register
      </Heading>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </Field.Root>
      <Button onClick={() => register(email, password)} loading={registerIsLoading}>
        Sign up
      </Button>
      <LabeledSeparator label="or" color="fg.subtle" my="2" />
      <Button variant="outline">
        <PiGoogleLogoBold />
        Continue with Google
      </Button>
    </VStack>
  );
}
