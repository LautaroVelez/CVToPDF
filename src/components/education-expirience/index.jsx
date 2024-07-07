import {Input} from "@nextui-org/input";

export default function EducationExpirience({ register, index }) {
    return (
        <>
            <Input label="Nombre de la escuela" className={'mt-10'} id={`education[${index}].nameSchool`} {...register(`education[${index}].nameSchool`)} />
            <Input label="Titulo del estudio" className={'mt-10'} id={`education[${index}].titleName`} {...register(`education[${index}].titleName`)} />
            <div className={'md:flex'}>
                <Input label="Desde" type={'date'} className={'mt-10 mr-5 w-1/2'} id={`education[${index}].fromEducation`} {...register(`education[${index}].fromEducation`)} />
                <Input label="Hasta" type={'date'} className={'mt-10 ml-5 w-1/2'} id={`education[${index}].toEducation`} {...register(`education[${index}].toEducation`)} />
            </div>
        </>
    );
}