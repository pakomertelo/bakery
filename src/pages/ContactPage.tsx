import { ErrorState, LoadingState } from '../components/ui/AsyncState'
import { BusinessDetails } from '../features/site/BusinessDetails'
import { useSiteSettings } from '../features/site/hooks'
export function ContactPage(){const q=useSiteSettings(); return <div className="page-shell py-12 sm:py-20"><p className="eyebrow">Hablemos</p><h1 className="page-title">Contacto</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Consulta nuestros datos públicos para resolver cualquier duda. Las solicitudes se confirman siempre de forma personal.</p><div className="mt-10">{q.isLoading?<LoadingState/>:q.isError||!q.data?<ErrorState/>:<BusinessDetails settings={q.data}/>}</div></div>}
