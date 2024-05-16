type PlayerProps = {
  username: string | undefined;
  color: string;
};

export default function Player({ username, color }: PlayerProps) {
  return (
    <li
      className={`font-semibold text-sm p-2 rounded-md`}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        color: color,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      {username}
    </li>
  );
}
