const getRandomColor = () => {
    const colors: string[] = [
        'ring-red-400 ring-offset-red-400',
        'ring-yellow-400 ring-offset-yellow-400',
        'ring-green-400 ring-offset-green-400',
        'ring-blue-400 ring-offset-blue-400',
        'ring-indigo-400 ring-offset-indigo-400',
        'ring-purple-400 ring-offset-purple-400',
        'ring-cyan-300 ring-offset-cyan-400',
        'ring-[#66347F] ring-offset-[#66347F]',
        'ring-[#19A7CE] ring-offset-[#19A7CE]',
        'ring-[#97DEFF] ring-offset-[#97DEFF]',
        'ring-[#F9F54B] ring-offset-[#F9F54B]',
        'ring-[#FCFC04] ring-offset-[#FCFC04]',
        'ring-[#FCAC34] ring-offset-[#FCAC34]',
        'ring-[#04FC04] ring-offset-[#04FC04]',
        'ring-[#FFFFFF] ring-offset-[#FFFFFF]',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
export default getRandomColor;