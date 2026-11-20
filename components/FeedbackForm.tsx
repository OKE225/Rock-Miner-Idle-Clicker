import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Btn, Txt } from "@/components/ui";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FeedbackType = "bug" | "idea" | "other";

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const send = async () => {
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanEmail) {
      setStatus("error");
      setError("Email address is required.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    if (cleanMessage.length < 5) {
      setStatus("error");
      setError("Message must be at least 5 characters long.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          email: cleanEmail,
          message: cleanMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error ?? "Could not send your message. Please try again later.",
        );
      }

      setStatus("ok");
      setMessage("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Could not send your message. Please try again later.",
      );
    }
  };

  return (
    <View className="rounded-xl border-2 border-panel bg-panel px-3.5 py-3 gap-2.5">
      <Txt d className="text-lg">
        Report a problem or idea
      </Txt>

      <Txt tone="mute" className="text-sm">
        Something broken? Tell me what to fix or improve.
      </Txt>

      <View className="flex-row gap-2 items-center">
        {(
          [
            ["bug", "Bug"],
            ["idea", "Idea"],
            ["other", "Other"],
          ] as [FeedbackType, string][]
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setType(value)}
            className={`rounded-lg border-2 px-3 py-2 ${
              type === value ? "border-amber bg-amber/10" : "border-panel"
            }`}>
            <Txt d={type === value}>{label}</Txt>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Your email *"
        placeholderTextColor="#8A8F98"
        autoCapitalize="none"
        keyboardType="email-address"
        className="rounded-lg border-2 border-panel bg-black/20 px-3 py-2.5 text-white"
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="What should I fix or improve? *"
        placeholderTextColor="#8A8F98"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="rounded-lg border-2 border-panel bg-black/20 px-3 py-2.5 text-white"
      />

      {status === "error" && error ? (
        <Txt tone="danger" className="text-sm">
          {error}
        </Txt>
      ) : null}

      {status === "ok" && (
        <Txt tone="ok" className="text-sm">
          Thanks! Your message was sent.
        </Txt>
      )}

      <Btn
        label={status === "sending" ? "Sending..." : "Send feedback"}
        onPress={send}
        disabled={status === "sending"}
      />

      {status === "sending" && <ActivityIndicator color="#FFC93C" />}
    </View>
  );
}
