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
    Row,
    Column,
} from '@react-email/components';
import * as React from 'react';

interface BookingNotificationEmailProps {
    instructorName: string;
    studentName: string;
    date: string;
    time: string;
    location: string;
    bookingId: string;
}

export const BookingNotificationEmail = ({
    instructorName,
    studentName,
    date,
    time,
    location,
    bookingId,
}: BookingNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>Nueva solicitud de reserva de {studentName}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Nueva Reserva Pendiente</Heading>
                <Text style={text}>Hola {instructorName},</Text>
                <Text style={text}>
                    Has recibido una nueva solicitud de reserva de <strong>{studentName}</strong>.
                </Text>

                <Section style={box}>
                    <Text style={paragraph}><strong>Fecha:</strong> {date}</Text>
                    <Text style={paragraph}><strong>Hora:</strong> {time}</Text>
                    <Text style={paragraph}><strong>Lugar:</strong> {location}</Text>
                </Section>

                <Link href={`https://surfapp-two.vercel.app/dashboard/instructor/bookings`} style={button}>
                    Gestionar Reserva
                </Link>
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

const box = {
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    margin: '20px 0',
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
