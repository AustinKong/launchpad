import { VStack, Heading, Input, Field, Button } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { PiGoogleLogoBold } from "react-icons/pi";
import LabeledSeparator from "@/components/LabeledSeparator";
import { login } from "@/services/auth";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/");
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <VStack w="30%" alignItems="stretch" h="fit-content">
      <Heading size="2xl" textAlign="center">
        Login
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
      <Button onClick={() => mutate({ email, password })} loading={isPending}>
        Login
      </Button>
      <LabeledSeparator label="or" color="fg.subtle" my="2" />
      <Button variant="outline">
        <PiGoogleLogoBold />
        Continue with Google
      </Button>
    </VStack>
  );
}
