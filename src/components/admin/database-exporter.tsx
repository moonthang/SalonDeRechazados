'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLLECTIONS_TO_EXPORT = ['salon', 'afterglow', 'config', 'users'];

export default function DatabaseExporter() {
    const [isExporting, setIsExporting] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleExport = async () => {
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'La conexión con la base de datos no está disponible.',
            });
            return;
        }

        setIsExporting(true);
        toast({
            title: 'Iniciando exportación',
            description: 'Esto puede tardar unos momentos...',
        });

        const exportData: { [key: string]: any[] } = {};
        let success = true;

        try {
            for (const collectionName of COLLECTIONS_TO_EXPORT) {
                const collectionRef = collection(firestore, collectionName);
                const querySnapshot = await getDocs(collectionRef);
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    Object.keys(docData).forEach(key => {
                        if (docData[key] && typeof docData[key].toDate === 'function') {
                            docData[key] = docData[key].toDate().toISOString();
                        }
                    });
                    return {
                        id: doc.id,
                        ...docData,
                    };
                });
                exportData[collectionName] = data;
            }
        } catch (error: any) {
            success = false;
            toast({
                variant: 'destructive',
                title: 'Error durante la exportación',
                description: error.message || 'No se pudieron obtener los datos de una o más colecciones.',
            });
        }

        if (success) {
            try {
                const jsonString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                link.download = `sdr-backup-${timestamp}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast({
                    title: 'Exportación completada',
                    description: 'El archivo JSON con el backup ha sido descargado.',
                });
            } catch (error: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Error al crear el archivo',
                    description: error.message || 'No se pudo generar el archivo de backup.',
                });
            }
        }

        setIsExporting(false);
    };

    return (
        <Card className="bg-background/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="w-6 h-6 text-primary" />
                    Backup de la Base de Datos
                </CardTitle>
                <CardDescription>
                    Descarga todas las colecciones principales (salon, afterglow, config, users) como un único archivo JSON.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleExport} disabled={isExporting}>
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exportando...' : 'Descargar Backup'}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                    Este archivo JSON es una copia de seguridad de tus datos. No es un archivo SQL, pero puede ser usado para migrar a otra base de datos en el futuro.
                </p>
            </CardContent>
        </Card>
    );
}
