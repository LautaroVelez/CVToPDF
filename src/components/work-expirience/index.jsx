import {Input} from "@nextui-org/input";
import {Textarea} from "@nextui-org/input";

export default function WorkExpirience({ register, index }) {
    return (
        <>
            <Input label="Nombre de la empresa" className={'mt-10'} id={`work[${index}].companyName`} {...register(`work[${index}].companyName`)} />
            <Input label="Posición" className={'mt-10'} id={`work[${index}].position`} {...register(`work[${index}].position`)} />
            <Textarea label="Detalles" className={'mt-10'} id={`work[${index}].details`} {...register(`work[${index}].details`)} />
            <div className={'md:flex'}>
                <Input label="Desde" type={'date'} className={'mt-10 mr-5 w-1/2'} id={`work[${index}].fromWork`} {...register(`work[${index}].fromWork`)} />
                <Input label="Hasta" type={'date'} className={'mt-10 ml-5 w-1/2'} id={`work[${index}].toWork`} {...register(`work[${index}].toWork`)} />
            </div>
        </>
    );
}