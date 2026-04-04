"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authErrorMessages } from "@/app/lib/auth/errors";
import { useAuthError } from "@/app/lib/auth/AuthErrorContext";

const loginSchema = z.object({
    email: z.string().min(1, "Enter your email").email("Invalid email"),
    password: z.string().min(1, "Enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
});

const { setError } = useAuthError();
// const [error, setError] = useState<string | null>(null);
  const router = useRouter();

const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/chat" // після входу
    });

    if (res?.status === 200) {
        router.push("/chat")
    }
  
    if (res?.error) {
        const message =
            authErrorMessages[res.error] ?? authErrorMessages.Default;
        setError(message);
        return;
    }
};

return (
        <Container maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 4,
                    // backgroundColor: theme.palette.background.paper,
                    // borderRadius: theme.shape.borderRadius,
                }}
            >
                
                <Typography
                    align="center"
                    gutterBottom
                    fontFamily={'Audiowide, cursive'}
                    fontSize={24}
                    // sx={{ color: theme.palette.primary.main }}
                >
                    Sign-in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Login"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        autoComplete="username"
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                // backgroundColor: theme.palette.background.default,
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        autoComplete="current-password"
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                // backgroundColor: theme.palette.background.default,
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        sx={{
                            mt: 2,
                            fontFamily: 'Audiowide, cursive',
                            fontSize: 16,

                            "&:hover": {
                                // backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Sign-in
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        sx={{
                            mt: 1,
                            // borderColor: theme.palette.secondary.main,
                            // color: theme.palette.secondary.main,
                            fontFamily: 'Audiowide, cursive',
                            fontSize: 16,
                            "&:hover": {
                                // borderColor: theme.palette.secondary.dark,
                                // color: theme.palette.secondary.dark,
                            },
                        }}
                        href="/registration"
                    >
                        Sign-up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}