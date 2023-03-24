export const detectLink = (text: string) => {
    // TODO:detect url
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url: string) {
        console.log({ url })
        const value = '<a href="' + url + '" className="underline cursor-pointer">' + url + '</a>';
        console.log({ value })
        return url
    });
}