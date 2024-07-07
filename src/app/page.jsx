'use client';
import {Input} from "@nextui-org/input";
import {Divider} from "@nextui-org/divider";
import WorkExpirience from "@/components/work-expirience";
import {Button} from "@nextui-org/button";
import {FaRegTrashAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa6";
import EducationExpirience from "@/components/education-expirience";
import {useState} from "react";
import {useForm} from 'react-hook-form';
import {jsPDF} from "jspdf";
import {Textarea} from "@nextui-org/input";

export default function Home() {
    const {register, handleSubmit, formState: {errors}, watch} = useForm();
    const [work, setWork] = useState([{id: 0, component: <WorkExpirience key={0} register={register} index={0}/>}]);
    const [education, setEducation] = useState([{
        id: 0,
        component: <EducationExpirience key={0} register={register} index={0}/>
    }]);

    const handleAddEducation = (e) => {
        e.preventDefault();
        const newId = education.length;
        setEducation([...education, {
            id: newId,
            component: <EducationExpirience key={newId} register={register} index={newId}/>
        }]);
    };

    const handleDeleteEducation = (id) => {
        setEducation(education.filter(item => item.id !== id));
    };

    const handleAddWork = (e) => {
        e.preventDefault();
        const newId = work.length;
        setWork([...work, {id: newId, component: <WorkExpirience key={newId} register={register} index={newId}/>}]);
    };

    const handleDeleteWork = (id) => {
        setWork(work.filter(item => item.id !== id));
    };

    const onSubmit = (data) => {
        const formData = watch();
        const photoFile = data.photo[0]; // Obtener el archivo de la foto

        // Capitalizar la primera letra de cada campo de entrada
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        formData.name = capitalize(formData.name);
        formData.lastname = capitalize(formData.lastname);
        formData.city = capitalize(formData.city);
        formData.summary = capitalize(formData.summary);

        formData.education = formData.education.map(item => ({
            ...item,
            titleName: capitalize(item.titleName),
            nameSchool: capitalize(item.nameSchool),
        }));

        formData.work = formData.work.map(item => ({
            ...item,
            position: capitalize(item.position),
            companyName: capitalize(item.companyName),
            details: capitalize(item.details),
        }));


        const doc = new jsPDF();

        // Definir constantes para el tamaño de la página y los márgenes
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const maxLineWidth = pageWidth - 2 * margin;

        // Función para agregar una nueva página si es necesario
        let currentY = 20; // Iniciar en el borde superior de la página
        const addNewPageIfNeeded = (heightNeeded) => {
            if (currentY + heightNeeded > pageHeight - margin) {
                doc.addPage(); // Agregar nueva página
                currentY = margin; // Reiniciar la posición vertical en la nueva página
            }
        };
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        reader.onloadend = () => {
            const photoDataUrl = reader.result;
            const img = new Image();
            img.src = photoDataUrl;
            img.onload = () => {
                addNewPageIfNeeded(60); // Adjust height as necessary for image and text layout
                doc.addImage(img, "JPEG", pageWidth-50, 5, 42, 42);

                // Sección de información personal
                doc.setFontSize(35);
                doc.setFont("times", "italic", "bold");
                doc.text(`${formData.name} ${formData.lastname}`, margin, currentY);
                currentY += 10;

                doc.setFont("times", "normal");
                doc.setFontSize(15);
                doc.text(`${formData.city}`, margin, currentY);
                currentY += 20;

                doc.line(margin, currentY, pageWidth - margin, currentY); // línea horizontal
                currentY += 10;

                // Sección de contacto
                doc.setFont("times", "normal", "bold");
                doc.setFontSize(18);
                doc.text('CONTACTO', margin, currentY);
                currentY += 2;

                doc.setFontSize(15);
                doc.line(margin, currentY, margin + 35, currentY); // línea horizontal
                currentY += 10;

                doc.setFont("times", "normal");
                doc.text(`${formData.email}`, margin, currentY);
                currentY += 7;

                doc.text(`${formData.linkedin}`, margin, currentY);
                currentY += 7;

                doc.text(`${formData.portfolio}`, margin, currentY);
                currentY += 15;

                // Ajustar el texto del sumario dentro del área especificada
                doc.setFont("times", "normal", "bold");
                doc.setFontSize(18);
                doc.text('SUMARIO', margin, currentY);
                currentY += 2;

                doc.setFontSize(15);
                doc.line(margin, currentY, margin + 32, currentY); // línea horizontal
                currentY += 10;

                doc.setFont("times", "normal");
                const linesSummary = doc.splitTextToSize(formData.summary, maxLineWidth);
                addNewPageIfNeeded(linesSummary.length * 10 + 10); // Verificar si es necesario agregar una nueva página
                doc.text(linesSummary, margin, currentY);
                currentY += linesSummary.length * 10;

                // Sección de Educación
                doc.setFont("times", "normal", "bold");
                doc.setFontSize(18);
                doc.text('EDUCACIÓN', margin, currentY);
                currentY += 2;

                doc.setFontSize(15);
                doc.line(margin, currentY, margin + 37, currentY); // línea horizontal
                currentY += 10;

                doc.setFont("times", "normal");
                formData.education.forEach((item, index) => {
                    addNewPageIfNeeded(30); // Verificar si es necesario agregar una nueva página

                    doc.setFontSize(16);
                    doc.setFont("times", "normal", "bold");
                    doc.text(`${item.titleName}`, margin, currentY);
                    currentY += 8;

                    doc.setFontSize(15);
                    doc.setFont("times", "normal");
                    doc.text(`${item.nameSchool}`, margin, currentY);
                    doc.text(`${item.fromEducation} - ${item.toEducation}`, margin, currentY + 8);
                    currentY += 20;
                });
                currentY += 10;

                // Sección de Experiencia Laboral
                doc.setFont("times", "normal", "bold");
                doc.setFontSize(18);
                doc.text('EXPERIENCIA LABORAL', margin, currentY);
                currentY += 2;

                doc.setFontSize(15);
                doc.line(margin, currentY, margin + 78, currentY); // línea horizontal
                currentY += 10;

                doc.setFont("times", "normal");
                formData.work.forEach((item, index) => {
                    addNewPageIfNeeded(40); // Verificar si es necesario agregar una nueva página

                    doc.setFontSize(16);
                    doc.setFont("times", "normal", "bold");
                    doc.text(`${item.position}`, margin, currentY);
                    currentY += 8;

                    doc.setFontSize(15);
                    doc.setFont("times", "normal");
                    doc.text(`${item.companyName}`, margin, currentY);

                    // Calcular el espacio que ocupa item.details
                    const linesDetails = doc.splitTextToSize(item.details, maxLineWidth);
                    const detailsHeight = linesDetails.length * 8;

                    // Verificar si es necesario agregar una nueva página para los detalles
                    addNewPageIfNeeded(detailsHeight + 30);

                    // Imprimir detalles
                    doc.text(linesDetails, margin, currentY + 8);
                    currentY += detailsHeight + 8;

                    // Imprimir fechas debajo de los detalles
                    doc.text(`${item.fromWork} - ${item.toWork}`, margin, currentY);
                    currentY += 10; // Ajuste para espacio entre experiencias laborales
                });

                doc.save("Curriculum.pdf");
            }
        }
            };


            return (
                <>
                    <h1 className={'text-5xl text-white font-bold text-center uppercase p-10 '}>Convertir tu curriculum
                        a pdf</h1>
                    <form id={'form'} onSubmit={handleSubmit(onSubmit)}>
                        <div className={'justify-center flex h-full items-center'}>
                            <div className={'w-1/2'}>
                                <h1 className={'text-4xl text-white font-bold mt-10 '}>INFORMACIÓN PERSONAL</h1>
                                <div className={'flex w-full'}>
                                    <Input {...register("name")} label="Nombre" className={'mt-10 w-1/2 mr-5'}
                                           id={'name'}
                                           required={true}/>
                                    <Input {...register("lastname")} label="Apellido" className={'mt-10 w-1/2 ml-5'}
                                           id={'lastname'} required={true}/>
                                </div>
                                <Input {...register("email")} label="Email" type={'email'} className={'mt-10'}
                                       id={'email'}
                                       required={true}/>
                                <Input {...register("city")} label="Ciudad" className={'mt-10'} id={'city'}
                                       required={true}/>

                                <div className={'flex w-full'}>
                                    <Input {...register("linkedin")} label="Linkedin" className={'mt-10 w-1/2 mr-5'}
                                           id={'linkedin'}
                                    />
                                    <Input {...register("portfolio")} label="Portfolio" className={'mt-10 w-1/2 ml-5'}
                                           id={'portfolio'}/>
                                </div>
                                <Textarea {...register("summary")} label="Describete" className={'mt-10'}
                                          id={'summary'}/>
                                <Input type="file" {...register("photo")} className={'mt-10'} size={"lg"} id={'photo'}
                                       accept="image/*" label="Fotografia personal" labelPlacement={"outside-left"}/>
                            </div>
                        </div>
                        <Divider orientation={'horizontal'} className="mt-10"/>

                        <div className={'justify-center flex h-full items-center mt-10'}>
                            <div className={'w-1/2'}>
                                <div className="flex justify-between items-center">
                                    <h1 className="text-4xl text-white font-bold">EXPERIENCIA EDUCATIVA</h1>
                                    <Button onClick={handleAddEducation}
                                            className={'justify-center w-1/5 flex text-center '} color={"warning"}
                                            variant={'ghost'} endContent={<FaPlus/>} isIconOnly>
                                    </Button>
                                </div>
                                {education.map((item, index) => (
                                    <div key={item.id}>
                                        <EducationExpirience key={index} register={register} index={index}/>
                                        <div className={'w-full flex justify-center'}>
                                            <Button onClick={() => handleDeleteEducation(item.id)}
                                                    className={'justify-center w-1/2 flex text-center mt-10'}
                                                    color={"warning"}
                                                    variant={'ghost'} endContent={<FaRegTrashAlt/>}>
                                                Eliminar Experiencia
                                            </Button>
                                        </div>
                                        <Divider orientation={'horizontal'} className={'mt-10'}/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Divider orientation={'horizontal'} className="mt-10"/>
                        <div className={'flex w-full justify-center'}>
                            <div className={'w-1/2'}>
                                <div className={'justify-between items-center flex mt-10'}>
                                    <h1 className="text-4xl text-white font-bold">EXPERIENCIA LABORAL</h1>
                                    <Button onClick={handleAddWork}
                                            className={'justify-center w-1/5 flex text-center '} color={"warning"}
                                            variant={'ghost'} endContent={<FaPlus/>} isIconOnly></Button>
                                </div>
                                {work.map((item, index) => (
                                    <div key={item.id}>
                                        <WorkExpirience key={index} register={register} index={index}/>
                                        <div className={'w-full flex justify-center mt-10'}>
                                            <Button onClick={() => handleDeleteWork(item.id)}
                                                    className={'justify-center w-1/2 flex text-center '}
                                                    color={"warning"}
                                                    variant={'ghost'} endContent={<FaRegTrashAlt/>}>
                                                Eliminar Experiencia
                                            </Button>
                                        </div>
                                        <Divider orientation={'horizontal'} className={'mt-10'}/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={'flex justify-center mt-10 pb-10'}>
                            <Button type={'submit'}
                                    className={'w-1/2 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'}>
                                Crear CV en PDF
                            </Button>
                        </div>
                    </form>
                </>
            );
        }