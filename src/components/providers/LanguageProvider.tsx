"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const translations = {
    es: {
        // Navbar
        search: "Buscar Instructores",
        howItWorks: "Cómo funciona",
        advisor: "AI Advisor",
        login: "Iniciar Sesión",
        register: "Registrarse",
        // Sidebar
        dashboard: "Panel Principal",
        myBookings: "Mis Reservas",
        messages: "Mensajes",
        profile: "Mi Perfil",
        settings: "Configuración",
        // Bookings Page
        bookingsTitle: "Mis Reservas",
        bookingsSubtitle: "Gestiona tus clases de surf",
        upcomingClasses: "Próximas Clases",
        history: "Historial",
        noBookings: "No tienes clases programadas",
        newBooking: "Nueva Reserva 🏄‍♂️",
        chatWithInstructor: "Chat con Instructor",
        cleanCancelled: "Limpiar Canceladas",
        // Messages Page
        messagesTitle: "Mensajes",
        clearAll: "Limpiar Todo",
        deleteChat: "Eliminar historial",
        noMessages: "No hay mensajes",
        startConversation: "Inicia una conversación...",
        // Common
        loading: "Cargando...",
        // Landing Page
        heroTitle: "Encuentra tu",
        heroHighlight: "Instructor de Surf",
        heroSubtitle: "Descubre las mejores olas de El Salvador. Conecta con instructores certificados en El Tunco, El Sunzal, Punta Roca y más.",
        heroBadge: "Surf City - El Salvador 🇸🇻",
        searchInstructors: "Buscar Instructores",
        imInstructor: "Soy Instructor",
        statsClasses: "Clases Impartidas",
        statsInstructors: "Instructores",
        statsRating: "Rating Promedio",
        howItWorksTitle: "¿Cómo Funciona?",
        howItWorksSubtitle: "Tres simples pasos para comenzar tu aventura en el surf",
        step1Title: "1. Busca",
        step1Desc: "Encuentra instructores certificados por ubicación, precio y nivel de experiencia",
        step2Title: "2. Reserva",
        step2Desc: "Elige el horario que mejor te convenga y confirma tu clase al instante",
        step3Title: "3. Surfea",
        step3Desc: "Disfruta de tu clase personalizada y califica tu experiencia",
        beachesBadge: "Surf City El Salvador",
        beachesTitle: "Playas de Surf en El Salvador",
        beachesSubtitle: "Descubre las mejores olas de Centroamérica en nuestras playas de clase mundial",
        exploreBeaches: "Explorar Todas las Playas",
        aiBadge: "Nuevo: AI Surf Advisor",
        aiTitle: "¿No estás seguro de dónde surfear hoy?",
        aiDesc: "Nuestro asistente experto conoce cada rincón de El Salvador. Desde el pronóstico en Punta Roca hasta la mejor pupusería en El Zonte.",
        aiCTA: "Consultar con el Experto",
        aiConsultations: "+500 consultas hoy",
        sunzalCaption: "\"El Sunzal es perfecto hoy para un longboard session. Waves are 3-4ft and glassy.\"",
        finalCTATitle: "¿Listo para Conquistar las Olas de El Salvador?",
        finalCTADesc: "Únete a cientos de surfistas que ya están mejorando su técnica con los mejores instructores de Surf City",
        startNow: "Comenzar Ahora",
    },
    en: {
        // Navbar
        search: "Search Instructors",
        howItWorks: "How it works",
        advisor: "AI Advisor",
        login: "Login",
        register: "Register",
        // Sidebar
        dashboard: "Dashboard",
        myBookings: "My Bookings",
        messages: "Messages",
        profile: "My Profile",
        settings: "Settings",
        // Bookings Page
        bookingsTitle: "My Bookings",
        bookingsSubtitle: "Manage your surf lessons",
        upcomingClasses: "Upcoming Classes",
        history: "History",
        noBookings: "No classes scheduled",
        newBooking: "New Booking 🏄‍♂️",
        chatWithInstructor: "Chat with Instructor",
        cleanCancelled: "Clear Cancelled",
        // Messages Page
        messagesTitle: "Messages",
        clearAll: "Clear All",
        deleteChat: "Delete chat history",
        noMessages: "No messages",
        startConversation: "Start a conversation...",
        // Common
        loading: "Loading...",
        // Landing Page
        heroTitle: "Find your",
        heroHighlight: "Surf Instructor",
        heroSubtitle: "Discover the best waves in El Salvador. Connect with certified instructors in El Tunco, El Sunzal, Punta Roca, and more.",
        heroBadge: "Surf City - El Salvador 🇸🇻",
        searchInstructors: "Search Instructors",
        imInstructor: "I'm an Instructor",
        statsClasses: "Lessons Given",
        statsInstructors: "Instructores", // Kept somewhat spanish or "Instructors"
        statsRating: "Average Rating",
        howItWorksTitle: "How it Works?",
        howItWorksSubtitle: "Three simple steps to start your surf adventure",
        step1Title: "1. Search",
        step1Desc: "Find certified instructors by location, price, and experience level",
        step2Title: "2. Book",
        step2Desc: "Choose the time that suits you best and confirm your lesson instantly",
        step3Title: "3. Surf",
        step3Desc: "Enjoy your personalized lesson and rate your experience",
        beachesBadge: "Surf City El Salvador",
        beachesTitle: "Surf Beaches in El Salvador",
        beachesSubtitle: "Discover Central America's best waves on our world-class beaches",
        exploreBeaches: "Explore All Beaches",
        aiBadge: "New: AI Surf Advisor",
        aiTitle: "Not sure where to surf today?",
        aiDesc: "Our expert assistant knows every corner of El Salvador. From the forecast at Punta Roca to the best pupusería in El Zonte.",
        aiCTA: "Ask the Expert",
        aiConsultations: "+500 daily consultations",
        sunzalCaption: "\"El Sunzal is perfect today for a longboard session. Waves are 3-4ft and glassy.\"",
        finalCTATitle: "Ready to Conquer El Salvador's Waves?",
        finalCTADesc: "Join hundreds of surfers improving their technique with Surf City's best instructors",
        startNow: "Start Now",
    },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("surf-app-lang") as Language
        if (saved) setLanguage(saved)
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("surf-app-lang", lang)
    }

    const t = (key: string) => {
        // @ts-ignore
        return translations[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
    return context
}
