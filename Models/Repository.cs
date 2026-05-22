namespace HuflitAlumniMeeting.Models
{
    public static class Repository
    {
        private static List<Guests> responses = new();
        public static IEnumerable<Guests> Responses => responses;
        public static void AddResponse(Guests response)
        {
            Console.WriteLine(response);
            responses.Add(response);
        }
    }
}
