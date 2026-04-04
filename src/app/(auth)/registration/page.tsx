'use client';
import { signIn } from "next-auth/react";

import React from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useCreateUser } from "./hooks/useCreateUser";
import { useRouter } from "next/navigation";


const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    nickName: z.string().min(2, "Nick name is required"),
    confirmPassword: z.string(),
    // dateOfBirth: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof schema>;
 


export default function RegistrationPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationForm>({
        resolver: zodResolver(schema),
    });

    const { createUser, loading, error } = useCreateUser();
    const router = useRouter();
    
    const onSubmit = async (data: RegistrationForm) => {
            
        try{   
            const res = await createUser({
                variables: {
                    email: data.email,
                    name: data.name,
                    password: data.password,
                    nickName: data.nickName,
                },
            });

            if (res.data?.createUser) {
                router.push("/sign-in");
            }
            
        } catch (err) {
            console.error(err);
        }
        
    };

    return (
        <Container maxWidth="sm">
            <Box
            sx={{
                mt: 8,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                // backgroundColor: '#121212',
            }}
            >
          <Typography
                align="center"
                gutterBottom
                fontFamily={'Audiowide, cursive'}
                fontSize={24}
                // sx={{ color: theme.palette.primary.main }}
            >
                Sign-up
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={1}>
                <TextField
                    label="Name"
                    fullWidth
                    required
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Nick name"
                    fullWidth
                    {...register("nickName")}
                    error={!!errors.nickName}
                    helperText={errors.nickName?.message}
                    sx={{ mb: 2 }}
                />

                {/* <TextField
                    label="Date of birth"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("dateOfBirth")}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    sx={{ mb: 2 }}
                /> */}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ 
                        mt: 2, 
                        backgroundColor: '#FFD700',
                        fontFamily: 'Audiowide, cursive',
                        fontSize: 16, 
                    }}
                >
                    Sign-up
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ 
                        mt: 2,
                        fontFamily: 'Audiowide, cursive',
                        fontSize: 16, 
                    }}
                    href="/sign-in"
                >
                    Back to Sign-in
                </Button>
                </Grid>
            </form>
            </Box>
        </Container>
    );
}