import FingerprintJS from "@fingerprintjs/fingerprintjs";


export async function getDevice(){
    const fp = await FingerprintJS.load();
    const result = await fp.get() ; 

    console.log("this is device visitor id -sh✅ in frontent" , result.visitorId)
    return result.visitorId ;
}