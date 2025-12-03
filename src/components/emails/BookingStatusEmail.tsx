import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Section,
} from '@react-email/components';
import * as React from 'react';

interface BookingStatusEmailProps {
    userName: string;
    status: 'confirmed' | 'cancelled' | 'completed';
    instructorName: string;
    date: string;
    time: string;
}

export const BookingStatusEmail = ({
    userName,
    status,
    instructorName,
    date,
    time,
}: BookingStatusEmailProps) => {
    const statusText = {
        confirmed: 'Confirmada',
        cancelled: 'Cancelada',
        completed: 'Completada',
    };

    const statusColor = {
        confirmed: '#10b981', // green
        cancelled: '#ef4444', // red
        completed: '#3b82f6', // blue
    };

    return (
        <Html>
            <Head />
            <Preview>Actualización de tu reserva: {statusText[status]}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Actualización de Reserva</Heading>
                    <Text style={text}>Hola {userName},</Text>
                    <Text style={text}>
                        El estado de tu reserva con <strong>{instructorName}</strong> ha cambiado a:
                    </Text>

                    <Section style={{ ...statusBox, borderColor: statusColor[status] }}>
                        <Text style={{ ...statusTitle, color: statusColor[status] }}>
                            {statusText[status]}
                        </Text>
                    </Section>

                    <Section style={box}>
                        <Text style={paragraph}><strong>Fecha:</strong> {date}</Text>
                        <Text style={paragraph}><strong>Hora:</strong> {time}</Text>
                    </Section>

                    <Link href="https://surfapp-two.vercel.app/bookings" style={button}>
                        Ver Mis Reservas
                    </Link>
                </Container>
            </Body>
        </Html>
    );
};

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

const box = {
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    margin: '20px 0',
};

const statusBox = {
    padding: '16px',
    borderLeft: '4px solid',
    backgroundColor: '#fff',
    margin: '20px 0',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
};

const statusTitle = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
    textTransform: 'uppercase' as const,
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
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
