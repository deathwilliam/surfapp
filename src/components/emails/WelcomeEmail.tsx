import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    firstName: string;
}

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Bienvenido a SurfConnect 🏄</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>¡Bienvenido a SurfConnect!</Heading>
                <Text style={text}>Hola {firstName},</Text>
                <Text style={text}>
                    Gracias por unirte a la comunidad de surf más grande de El Salvador.
                    Estamos emocionados de ayudarte a encontrar tu próxima ola.
                </Text>
                <Link href="https://surfapp-two.vercel.app/search" style={button}>
                    Buscar Instructores
                </Link>
                <Text style={footer}>
                    Si tienes alguna pregunta, no dudes en responder a este correo.
                </Text>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const h1 = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    color: '#1a1a1a',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
};

const button = {
    backgroundColor: '#0070f3',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px',
    marginTop: '20px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    marginTop: '20px',
};
