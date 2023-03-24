function Audio({ base, type }: { base: string, type: string }) {
    return <audio controls>
        <source src={base} type={`audio/${type}`} />
    </audio>
}
export default Audio